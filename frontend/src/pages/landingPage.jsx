import React from 'react'
import { Navbar } from '../components'
import { Example } from '../components/Sidebar'
import ShuffleHero from '../components/Hero'
export default function landingPage() {
  return (
    <>
      <div className=' top-0'>
        <Navbar />
      </div>
      <ShuffleHero />

    </>
  )
}
