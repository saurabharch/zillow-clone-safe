/* eslint-disable react/jsx-props-no-spreading */
import { RadioGroup } from '@headlessui/react'
import { ReactElement, useEffect } from 'react'
import PopoverMenu from 'src/components/molecules/PopoverMenu'
import debounce from 'lodash.debounce'
import {
  PopoverButton,
  PopoverOverlay,
  PopoverPanel,
} from 'src/components/molecules/PopoverMenu/PopoverMenu'
import FilterIcon from '@heroicons/react/outline/FilterIcon'
import Mapbox from 'src/components/organisms/Mapbox'
import PropertyCard from 'src/components/organisms/PropertyCard'
import { Controller, useForm, useWatch } from 'react-hook-form'
import SliderMui from 'src/components/molecules/SliderMui'
import {
  addDollar,
  shorten,
} from 'src/components/molecules/SliderMui/SliderMui'
import Autocomplete from 'src/components/molecules/Autocomplete'
import { useRouter, withRouter } from 'next/dist/client/router'

export interface IProductListingPageProps {
  city: string
}

const MenuItem = ({
  children,
  title,
}: {
  children: ReactElement
  title: string
}) => (
  <PopoverMenu>
    <PopoverButton>
      {title} <span aria-hidden>▾</span>
    </PopoverButton>
    <PopoverOverlay />
    <PopoverPanel className='w-56 space-y-2 text-gray-600'>
      {children}
    </PopoverPanel>
  </PopoverMenu>
)

interface FilterState {
  search?: string
  lat?: number
  lng?: number
  yearBuilt?: [number, number]
  price?: [number, number]
  sqft?: [number, number]
  beds?: number
  bath?: number
  homeType?: string[]
}

const ProductListingPage = () => {
  const router = useRouter()
  const {
    search,
    lat,
    lng,
    yearBuilt,
    price,
    sqft,
    beds,
    bath,
    homeType,
  }: FilterState = router.query

  console.log(search, lat, lng, yearBuilt, price, sqft, beds, bath, homeType)

  const initialFilterState: FilterState = {
    search: search || '',
    yearBuilt: yearBuilt || [1800, 2022],
    price: price || [0, 10_000_000],
    sqft: sqft || [0, 20_000],
    beds: beds || 5,
    bath: bath || 5,
    homeType: homeType || [],
  }

  const {
    register,
    control,
    reset,
    getValues,
    watch,
    formState: { dirtyFields, isDirty },
  } = useForm({
    defaultValues: initialFilterState,
  })

  const watchAllData = useWatch({
    control,
  })

  useEffect(() => {
    const dirtyFieldsArray = Object.keys(dirtyFields)
    const filtered = Object.keys(watchAllData)
      .filter((key) => dirtyFieldsArray.includes(key))
      .reduce((obj, key) => {
        obj[key] = watchAllData[key]
        return obj
      }, {})

    console.log('filtered', filtered)

    // router.push(
    //   {
    //     pathname: '/homes',
    //     query: {
    //       ...router.query,
    //       ...filtered,
    //     },
    //   },
    //   undefined,
    //   { shallow: true }
    // )
  }, [dirtyFields, router, watchAllData])

  return (
    <div>
      <div className='container mx-auto'>
        <div className='sticky top-0 z-10 flex items-center gap-12 py-3 bg-white bg-opacity-90 backdrop-filter backdrop-blur-sm'>
          {/* <input type='text' className='w-64 px-2 py-3' placeholder='Search' /> */}
          {/* <SearchBox className='w-64 rounded-md' /> */}
          <button
            type='button'
            onClick={() => reset({ search: '' }, { keepDirty: false })}
          >
            reset
          </button>

          <Controller
            control={control}
            name='search'
            render={({ field: { onChange, value } }) => (
              <Autocomplete
                onChange={onChange}
                value={value || ''}
                options={[
                  'new york',
                  'los angeles',
                  'san francisco',
                  'chicago',
                  'houston',
                  'philadelphia',
                ]}
                className='px-2 py-2'
              />
            )}
          />

          <MenuItem title='Price'>
            <Controller
              control={control}
              name='price'
              render={({ field: { onChange, value } }) => (
                <div>
                  <div className='font-semibold'>Price range</div>
                  <SliderMui
                    onChange={onChange}
                    value={value || [0, 1_000_000]}
                    initialData={[0, 1_000_000]}
                    step={10_000}
                    className='mt-12'
                    labelFormat={(sliderValue) =>
                      `${addDollar(shorten(sliderValue))}`
                    }
                  />
                </div>
              )}
            />
          </MenuItem>
          <MenuItem title='Year built'>
            <Controller
              control={control}
              name='yearBuilt'
              render={({ field: { onChange, value } }) => (
                <div>
                  <div className='font-semibold'>Price range</div>
                  <SliderMui
                    onChange={onChange}
                    value={value}
                    initialData={[1900, 2022]}
                    step={10}
                    className='mt-12'
                  />
                </div>
              )}
            />
          </MenuItem>
          <MenuItem title='Sqft'>
            <Controller
              control={control}
              name='sqft'
              render={({ field: { onChange, value } }) => (
                <div>
                  <div className='font-semibold'>Price range</div>
                  <SliderMui
                    onChange={onChange}
                    value={value || [0, 10_000]}
                    initialData={[0, 10_000]}
                    step={1_000}
                    className='mt-12'
                    labelFormat={(sliderValue) => `${sliderValue} sqft`}
                  />
                </div>
              )}
            />
          </MenuItem>

          <MenuItem title='Beds & Bath'>
            <>
              <Controller
                control={control}
                name='beds'
                render={({ field: { onChange, value } }) => (
                  <RadioGroup
                    value={value}
                    onChange={onChange}
                    className='space-y-2'
                  >
                    <RadioGroup.Label>Bedrooms</RadioGroup.Label>
                    <div className='flex gap-3'>
                      <RadioGroup.Option value='any'>
                        {({ checked }) => (
                          <span
                            className={
                              checked ? 'border border-primary-500 p-2' : 'p-2'
                            }
                          >
                            Any
                          </span>
                        )}
                      </RadioGroup.Option>
                      <RadioGroup.Option value='1+'>
                        {({ checked }) => (
                          <span
                            className={
                              checked ? 'border border-primary-500 p-2' : 'p-2'
                            }
                          >
                            1+
                          </span>
                        )}
                      </RadioGroup.Option>
                      <RadioGroup.Option value='2+'>
                        {({ checked }) => (
                          <span
                            className={
                              checked ? 'border border-primary-500 p-2' : 'p-2'
                            }
                          >
                            2+
                          </span>
                        )}
                      </RadioGroup.Option>
                      <RadioGroup.Option value='3+'>
                        {({ checked }) => (
                          <span
                            className={
                              checked ? 'border border-primary-500 p-2' : 'p-2'
                            }
                          >
                            3+
                          </span>
                        )}
                      </RadioGroup.Option>
                      <RadioGroup.Option value='4+'>
                        {({ checked }) => (
                          <span
                            className={
                              checked ? 'border border-primary-500 p-2' : 'p-2'
                            }
                          >
                            4+
                          </span>
                        )}
                      </RadioGroup.Option>
                      <RadioGroup.Option value='5+'>
                        {({ checked }) => (
                          <span
                            className={
                              checked ? 'border border-primary-500 p-2' : 'p-2'
                            }
                          >
                            5+
                          </span>
                        )}
                      </RadioGroup.Option>
                    </div>
                  </RadioGroup>
                )}
              />
              <Controller
                control={control}
                name='bath'
                render={({ field: { onChange, value } }) => (
                  <RadioGroup
                    value={value}
                    onChange={onChange}
                    className='mt-4 space-y-2'
                  >
                    <RadioGroup.Label className='mt-4'>
                      Bathrooms
                    </RadioGroup.Label>
                    <div className='flex gap-3'>
                      <RadioGroup.Option value='1+'>
                        {({ checked }) => (
                          <span
                            className={
                              checked ? 'border border-primary-500 p-2' : 'p-2'
                            }
                          >
                            1+
                          </span>
                        )}
                      </RadioGroup.Option>
                      <RadioGroup.Option value='2+'>
                        {({ checked }) => (
                          <span
                            className={
                              checked ? 'border border-primary-500 p-2' : 'p-2'
                            }
                          >
                            2+
                          </span>
                        )}
                      </RadioGroup.Option>
                      <RadioGroup.Option value='3+'>
                        {({ checked }) => (
                          <span
                            className={
                              checked ? 'border border-primary-500 p-2' : 'p-2'
                            }
                          >
                            3+
                          </span>
                        )}
                      </RadioGroup.Option>
                      <RadioGroup.Option value='4+'>
                        {({ checked }) => (
                          <span
                            className={
                              checked ? 'border border-primary-500 p-2' : 'p-2'
                            }
                          >
                            4+
                          </span>
                        )}
                      </RadioGroup.Option>
                      <RadioGroup.Option value='5+'>
                        {({ checked }) => (
                          <span
                            className={
                              checked ? 'border border-primary-500 p-2' : 'p-2'
                            }
                          >
                            5+
                          </span>
                        )}
                      </RadioGroup.Option>
                    </div>
                  </RadioGroup>
                )}
              />
            </>
          </MenuItem>
          <MenuItem title='Home Type'>
            <fieldset style={{ float: 'left' }}>
              <legend>With the same name</legend>
              {['rainbow', 'sdf', 'sdfs'].map((c, i) => (
                <label key={c}>
                  <input
                    type='checkbox'
                    value={c}
                    {...register(`homeType.${i}`)}
                  />
                  {c}
                </label>
              ))}
            </fieldset>
          </MenuItem>

          <button type='button' className='ml-auto text-primary-600'>
            <FilterIcon className='w-5 h-5 lg:hidden' />
          </button>
        </div>
        <div className='flex gap-5'>
          <div className='flex-1 hidden lg:block'>
            <div className='sticky top-0 col-span-1 overflow-hidden rounded'>
              <Mapbox
                latitude={parseFloat(lat) || 37.7577}
                longitude={parseFloat(lng) || -122.4376}
                zoom={12}
                markers={[
                  { id: '1', latitude: 42.360081, longitude: -71.0583 },
                  { id: '2', latitude: 42.360081, longitude: -71.0585 },
                ]}
                className='h-screen'
              />
            </div>
          </div>
          <div className='grid flex-1 grid-cols-1 col-span-1 gap-5 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2'>
            <PropertyCard />
            <PropertyCard />
            <PropertyCard />
            <PropertyCard />
            <PropertyCard />
            <PropertyCard />
            <PropertyCard />
            <PropertyCard />
            <PropertyCard />
          </div>
        </div>
      </div>
    </div>
  )
}

export default withRouter(ProductListingPage)
