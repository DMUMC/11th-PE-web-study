import { createFileRoute } from '@tanstack/react-router'
import { movies } from '../data/movies'

export const Route = createFileRoute('/movies/$movieId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { movieId } = Route.useParams()
  const movie = movies.find(
    movie => movie.id === Number(movieId)
  )
  const genre = movie?.genres;
  const score = [1, 2, 3, 4, 5];
  const movieLastId = movies.length;
  console.log(movieLastId);
  return (
    <>{Number(movieId) <= movieLastId ? <>
      <div className="relative text-white">
        <img src={movie?.backdropPath} className="w-full h-[360px] object-cover" />
        <div className='px-[80px]'>
          <div className='absolute top-[24px] flex items-center'>
            <img src='/icon/movie-icons/chevron-left.svg' className='w-[24px] h-[24px]' />
            <p className=' font-[700] text-[13px]'>영화 목록</p>
          </div>
          <div className='absolute top-[210px] gap-[8px]'>
            <p className='font-[700] text-[46px]'>{movie?.title}</p>
            <p className='font-[400] text-[14px]'>{movie?.originalTitle}</p>
            <div className='flex items-center gap-[8px] font-[700] text-[13px]'>
              <p>{movie?.releaseDate}</p>
              {genre?.map((ganre, index) => (
                <p>
                  {ganre}
                  {index !== genre.length - 1 && " ·"}
                </p>
              ))}

              <p>{movie?.runtime}</p>
            </div>
          </div>
        </div>
      </div>
      {/**bottom */}
      <div className='flex py-[24px] gap-[30px]'>
        {/**왼쪽 */}
        <img src={movie?.posterPath} className='w-[200px] h-[286px] rounded-[16px]' />
        {/**가운데 */}
        <div className='flex-1 flex flex-col gap-[12px]'>
          <p className='font-[700] text-[21px] text-[#17191E]'>{movie?.tagline}</p>
          <p className='font-[400] text-[14px] text-[#606774]'>{movie?.overview}</p>
          {/* isBookmarked: boolean; */}
          <div className='w-[108px] h-[42px] bg-[#2563EB] rounded-[8px] flex items-center gap-[8px]
          font-[800] text-[14px] text-white justify-center'>
            <img src="/icon/movie-icons/bookmarkNo.svg" className='w-[16px] h-[16px]' />
            <p>즐겨찾기</p>
          </div>
        </div>
        {/**오른쪽 */}
        <div className='flex flex-col gap-[8px] w-[360px] pl-[30px] border-l-1 border-[#E3E6EB]'>
          <p className='font-[700] text-[21px] text-[##17191E]'>내 평점</p>
          <p className='font-[400] text-[12px] text-[#969DA8]'>별점은 필수, 후기는 선택이에요.</p>
          <div className='flex gap-[4px]'>
            {score.map((num) => (
              <img src='/icon/movie-icons/oneScore.svg' className='w-[38px] h-[38px]' />
            ))}
          </div>
          <div className='w-[330px] h-[102px] px-[12px] py-[18px] rounded-[16px] bg-white border-1 border-[#E3E6EB]
          placeholder:text-[13px] placeholder:font-[400]'>
            <textarea className='w-full h-full
          placeholder:text-[13px] placeholder:font-[400]'
              placeholder='영화를 보고 느낀 점을 남겨보세요.'>
            </textarea>
          </div>
          <div className='w-[330px] h-[42px] bg-[#17191E] rounded-[8px] text-white px-[16px] flex items-center justify-center
          text-[14px] font-[800]'>
            평점 저장
          </div>
        </div>
      </div>
    </> :
      <>
        <p className='mt-[24px]'>영화를 찾을 수 없어요.</p>
      </>
    }
    </>
  )
}
