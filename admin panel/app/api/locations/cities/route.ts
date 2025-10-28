import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const stateCode = searchParams.get('state')
  
  if (!stateCode) {
    return NextResponse.json({ error: 'State code is required' }, { status: 400 })
  }
  
  try {
    const response = await fetch(`https://api.countrystatecity.in/v1/countries/IN/states/${stateCode}/cities`, {
      headers: {
        'X-CSCAPI-KEY': 'NHhvOEcyWk50N2Vna3VFTE00bFp3MjFKR0ZEOUhkZlg4RTk1MlJlaA=='
      }
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch cities')
    }
    
    const cities = await response.json()
    return NextResponse.json(cities.map((city: any) => city.name))
  } catch (error) {
    const fallbackCities = ['Sample City 1', 'Sample City 2', 'Sample City 3']
    return NextResponse.json(fallbackCities)
  }
}