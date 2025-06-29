import React, { useState } from 'react'

const NavBar = () => {
    const [Active,setActive] = useState(1)

    console.log(Active)
  return (
    <>
    <navbar>
        <ul>
            <li>
                <button onCLick={()=>setActive(0)}>QR</button>
            </li>
            <li>
                <button onCLick={()=>setActive(1)}>User</button>
            </li>
        </ul>
    </navbar>
    </>
  )
}

export default NavBar