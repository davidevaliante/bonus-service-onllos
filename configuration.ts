export interface Config {
    streamerId : string | number 
    streamerName : string
    api : string
    primaryColor : string
    secondaryColor : string
    fontString : string
    font : string
    youtubeMetatag? : string
    geoApi: string
}

export const configuration : Config = {
    streamerId : 13,
    streamerName : 'onllos',
    api : 'https://compare.topadsservices.com',
    primaryColor : '#2b2b2b',
    secondaryColor : '#1dad44',
    fontString : "https://fonts.googleapis.com/css2?family=Hachi+Maru+Pop&display=swap",
    font : 'Roboto',
    geoApi : 'https://api.ipgeolocation.io/ipgeo?apiKey=d9c8ca199b3f40fabc69dfdfefdc9aa2'
}

