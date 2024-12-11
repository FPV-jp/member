import loading from './assets/loading.svg'

export const Loading = () => (
  <div className='spinner'>
    <img src={loading} alt='Loading...' />
  </div>
)

/* eslint-disable react/prop-types */
export function Error({ message }) {
  return (
    <div className='alert alert-danger' role='alert'>
      Oops... {message}
    </div>
  )
}
