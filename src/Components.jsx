export function Loading() {
  return (
    <div className='text-center'>
      <div className='spinner-border' role='status'>
        <span className='sr-only'>Loading...</span>
      </div>
    </div>
  )
}

/* eslint-disable react/prop-types */
export function Error({ message }) {
  return (
    <div className='alert alert-danger' role='alert'>
      Oops... {message}
    </div>
  )
}
