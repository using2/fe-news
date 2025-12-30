import header from "../components/header.js";
import headelineSlider from "../components/headlineSlider.js";
import newsFeed from "../components/newsFeed.js";

export default function newsstand() {
    return header() + headelineSlider() + newsFeed(); 
}
