import AuthBoundary from '../../components/auth-boundary';
export default function Layout({children}:{children:React.ReactNode}) { return <AuthBoundary>{children}</AuthBoundary>; }
