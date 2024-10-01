import React from 'react'
import Hero from '../../Components/Hero/Hero'
import Popular from '../../Components/Popular/Popular'
import Offers from '../../Components/Offers/Offers'
import NewCollection from '../../Components/NewCollection'
import NewsLetter from '../../Components/NewsLetter'

export default function Shop() {
  return (
    <div>
        <Hero />
        <Popular />
        <Offers />
        <NewCollection />
        <NewsLetter />
    </div>
  )
}
