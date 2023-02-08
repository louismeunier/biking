import erie from "./gpx/eriecanalway.gpx?raw";
import hudson from "./gpx/hudsonvalleygreenway.gpx?raw";
import helderberg from "./gpx/albanyhelderbergrailtrail.gpx?raw";
import electric from "./gpx/albanyhudsonelectrictrail.gpx?raw";
import mohawk from "./gpx/mohawkhudson.gpx?raw";
import champlain from "./gpx/champlainvalley.gpx?raw";
import oldmontreal from "./gpx/oldmontreal.gpx?raw";

// can change order of this to change layering
// the earlier in the array, the lower the layer
export const trailSettings = [
    { name: "Albany-Hudson Electric Trail", color: "navy", gpx: electric, image: "/empirestatetrail.png", imageAlt: "Empire State Trail"},
    { name: "Mohawk-Hudson Bike-Hike Trail", color: "darkgreen", gpx: mohawk, image: "/empirestatetrail.png", imageAlt: "Empire State Trail" },
    { name: "Erie Canalway Trail", color: "lightgreen", gpx: erie, image: "/empirestatetrail.png", imageAlt: "Empire State Trail" },
    { name: "Hudson Valley Greenway Trail", color: "cornflowerblue", gpx: hudson, image: "/empirestatetrail.png", imageAlt: "Empire State Trail" },
    { name: "Helderberg-Hudson Rail Trail", color: "orange", gpx: helderberg, image: "/helderberg.png", imageAlt: "Helderberg" },
    { name: "Champlain Valley Bikeway", color: "purple", gpx: champlain, image: "/empirestatetrail.png", imageAlt: "Empire State Trail" },
    { name: "Old Montreal Trail", color: "orange", gpx: oldmontreal, image: "/veloquebec.png", imageAlt: "MTR"  },
]