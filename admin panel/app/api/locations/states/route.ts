import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const response = await fetch('https://api.countrystatecity.in/v1/countries/IN/states', {
      headers: {
        'X-CSCAPI-KEY': 'NHhvOEcyWk50N2Vna3VFTE00bFp3MjFKR0ZEOUhkZlg4RTk1MlJlaA=='
      }
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch states')
    }
    
    const states = await response.json()
    return NextResponse.json(states.map((state: any) => ({
      code: state.iso2,
      name: state.name
    })))
  } catch (error) {
    const fallbackStates = [
      { code: 'WB', name: 'West Bengal' },
      { code: 'MH', name: 'Maharashtra' },
      { code: 'DL', name: 'Delhi' },
      { code: 'KA', name: 'Karnataka' },
      { code: 'TN', name: 'Tamil Nadu' }
    ]
    return NextResponse.json(fallbackStates)
  }
}