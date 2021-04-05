import styled from 'styled-components'
import Head from 'next/head'
import React, { FunctionComponent, useEffect, useState } from 'react';
import axios from 'axios';
import { configuration } from '../configuration';
import AquaClient from '../graphql/aquaClient';
import { Streamer, StreamerBonus } from '../models/streamer';
import Wrapper from '../components/Layouts/Wrapper';
import BonusStripe from '../components/BonusStripe/BonusStripe';
import VideoDiscalimer from '../components/VideoDisclaimer/VideoDisclaimer';
import FullPageLoader from '../components/FullPageLoader';
import Container from '../components/Layouts/Container';

interface Props {
  streamerData : Streamer
}

const index : FunctionComponent<Props> = ({streamerData}) => {

    const [loading, setLoading] = useState(true)
    const [country, setCountry] = useState<string>('')
    useEffect(() => {
      if(country !== '') getBonusList()
    }, [country])
    const [bonuses, setBonuses] = useState<StreamerBonus[] | undefined>(undefined)
    useEffect(() => {
      console.log(bonuses)
    }, [bonuses])

    console.log(streamerData)
   
    useEffect(() => {
        geoLocate()
    }, [])

    const geoLocate = async () => {
        setCountry('it')
    }

    const getBonusList = async () => {
        let bonusForCountry = streamerData.countryBonusList.filter(it => it.label === country)
        if(bonusForCountry.length == 0) bonusForCountry = streamerData.countryBonusList.filter(it => it.label === 'row')

        const requests = bonusForCountry[0].bonuses.map(b =>  axios.get(`${configuration.api}/bonuses/${b.id}`))

        const bList = await Promise.all(requests) 

        console.log(bList.map(r => r.data as StreamerBonus[]))

        setBonuses(bList.map(r => r.data as StreamerBonus))
        setLoading(false)
    }

    if(loading) return <FullPageLoader />
    return (
        <Wrapper>
            <Container>
                <div className='top-bar'>
                    <img className='logo' src='/icons/app_icon.png' />
                </div>

                <h1>Migliori casinò legali dove trovare questi giochi:</h1>

                {bonuses && bonuses.length > 2 && bonuses.map((bonus : StreamerBonus) => <BonusStripe key={`${bonus.name}`} bonus={bonus} countryCode={country} />)}

                {bonuses && bonuses.length <= 2 && streamerData.bonuses.map((bonus : StreamerBonus) => <BonusStripe key={`${bonus.name}`} bonus={bonus} countryCode={country} />)}

                <div style={{ padding: '1rem' }}>
                    <VideoDiscalimer />
                </div>
                <div className='bottom'>
                    <p style={{textAlign : 'center'}}>This service is provided by <a href='https://www.topaffiliation.com'>Top Affiliation</a></p>
                </div>
            </Container>
        </Wrapper>
    )
}

export async function getServerSideProps({ query }) {

  const pickedBonus = query.options

  const aquaClient = new AquaClient()

  const streamer = await axios.get(`${configuration.api}/streamers/${configuration.streamerId}`)
 
  return {
      props: {
          streamerData : streamer.data as Streamer,
      }
  }
}

export default index
