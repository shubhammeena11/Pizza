import React, { useRef } from 'react'
import Product from './Product'

function Home() {
  const productRef = useRef(null);

  return (
    <>
      <div className='flex justify-between items-center pl-20 pr-40'>
        <div>
          <p className='italic font-medium'>are you hungry?</p>
          <h2 className='text-4xl font-bold'>Don't Wait !</h2>

          <button
            className="bg-orange-400 text-white font-medium flex items-center justify-center gap-1 px-2 mt-2 rounded-full"
            onClick={() => {
              productRef.current?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Order now
          </button>
        </div>

        <div>
          <img src="public/images/pizza.png" alt="pizza" width={400} />
        </div>
      </div>

      {/* 👇 Attach ref here */}
      <div ref={productRef}>
        <Product />
      </div>
    </>
  )
}

export default Home