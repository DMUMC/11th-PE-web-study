#!/usr/bin/env python3
"""Load local ignored environment values without printing credentials."""
from pathlib import Path
import os
import subprocess
import sys

root = Path(__file__).resolve().parents[1]
env = os.environ.copy()
for line in (root / '.env').read_text().splitlines():
    if '=' in line and not line.lstrip().startswith('#'):
        key, value = line.split('=', 1)
        env[key] = value

mode = sys.argv[1] if len(sys.argv) > 1 else 'run'
if mode == 'run':
    command = ['./gradlew', 'bootRun', '--console=plain']
elif mode == 'db-check':
    env['MYSQL_PWD'] = env['DB_PW']
    command = ['/opt/homebrew/opt/mysql@8.4/bin/mysql', '-h', '127.0.0.1',
               '-u', env['DB_USER'], '-N', '-e',
               'USE umc_week02_20260927; SHOW TABLES; SELECT category_id, name FROM category; '
               'SELECT book_id, category_id, title FROM book; SELECT user_id, nickname FROM users; '
               'SELECT rental_id, user_id, book_id, rented_at, due_at, '
               'TIMESTAMPDIFF(DAY, rented_at, due_at) AS rental_days '
               'FROM rental ORDER BY rental_id DESC LIMIT 1;']
else:
    raise SystemExit('Supported modes: run, db-check')
raise SystemExit(subprocess.call(command, cwd=root, env=env))
