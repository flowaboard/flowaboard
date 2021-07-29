class Wiki {
    static apiEndPoint = 'https://en.wikipedia.org/api/rest_v1'
    static wikiUrlInit='https://en.wikipedia.org/wiki/';
    static async fetchSummary(wikiUrl) {
        var title=wikiUrl.replace(Wiki.wikiUrlInit,'')
        var response = (await(await fetch(Wiki.apiEndPoint + "/page/summary/" + title, {
            "headers": {
                "accept": "application/json; charset=utf-8; profile=\"https://www.mediawiki.org/wiki/Specs/Summary/1.4.2\"",
            }

        })).json())
        return {
            description:response.description
        }
    }
    static isWikiUrl(url){
        return url.indexOf(Wiki.wikiUrlInit)==0
    }
}

export default Wiki