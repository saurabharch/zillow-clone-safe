import Image from 'src/components/atoms/Image'
import Link from 'src/components/atoms/Link'

export interface ICityCardProps {
  title: string
  src?: string
}

const CityCard = ({
  src = 'https://res.cloudinary.com/thankyou/image/upload/v1640715615/nike/cities/newyork_zqnljo.jpg',
  title = 'New York',
}: ICityCardProps) => (
  <Link
    href={{
      pathname: '/homes',
      query: { city: title },
    }}
    className='relative block mt-2 mb-12 overflow-hidden transition-all duration-500 border-2 border-white rounded-md shadow-md cursor-pointer hover:scale-110 hover:shadow-xl hover:z-10 group w-96 h-96'
  >
    <Image
      className='h-full transition-all duration-700 scale-110 group-hover:brightness-110 brightness-95 group-hover:scale-100'
      alt=''
      src={src}
    />
    <div className='absolute bottom-0 pt-24 pb-3 pl-3 pr-24 text-white bg-gradient-to-tr from-primary-800 via-transparent to-transparent'>
      <div className='text-2xl font-semibold tracking-tighter'>{title}</div>
      <div className='text-sm text-opacity-75'>24,899 properties</div>
    </div>
  </Link>
)

export default CityCard
