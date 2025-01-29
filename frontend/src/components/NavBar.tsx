import {NavLink} from 'react-router-dom'
import { useContext } from 'react'

import { ThemeContextType } from '../@types/context'
import { ThemeContext } from '../utilities/globalContext'

export default function NavBar(){
    const {mode, toggleMode} = useContext(ThemeContext) as ThemeContextType
    return(
      <nav className="flex justify-center gap-5">
        <NavLink className="m-3 p-4 text-xl bg-blue-400 hover:bg-blue-500 rounded-md font-medium text-white" to={'/'}>All Entries</NavLink>
        <NavLink className="m-3 p-4 text-xl bg-blue-400 hover:bg-blue-500 rounded-md font-medium text-white" to={'/create'}>New Entry</NavLink>
        <button onClick={toggleMode}>Mode</button>
      </nav>
    )
}