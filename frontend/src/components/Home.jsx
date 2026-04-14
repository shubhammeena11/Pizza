import React, { useRef } from 'react'
import Product from './Product'
import pizza from "../images/pizza.png";


function Home() {
  const productRef = useRef(null);

  return (
    <>
      <div className='px-4 sm:px-6 lg:px-20 flex flex-col md:flex-row justify-between items-center gap-10'>
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
          <img src={pizza} alt="pizza" className="w-full max-w-md" />
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