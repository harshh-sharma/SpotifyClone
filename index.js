async function getSongs(){
    const response = await fetch('http://127.0.0.1:5500/songs/')
    const data = await response.text();
    const div = document.createElement('div');
    div.innerHTML = data;
    const as = div.getElementsByTagName('a');
    const songs = [];
    for(i = 0 ; i < as.length ; i++){
        const element = as[i];
        if(element.href.endsWith('mp3')){
            songs.push(element.href);
        }
    }
    return songs;
}

async function main(){
    const songs = await getSongs();
    console.log(songs);
    
    var audio = new Audio(songs[0]);
    audio.play();

}

main();