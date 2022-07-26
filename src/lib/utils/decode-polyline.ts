import type { LatLngExpression } from "leaflet"

// https://github.com/jhermsmeier/node-google-polyline
var PRECISION = 1e5

function sign(value:number):number {
  return value & 1 ? ~( value >>> 1 ) : ( value >>> 1 )
}

function integers(value:string, callback:Function):number {
  var values = 0
  var x = 0
  var y = 0

  var byte = 0
  var current = 0
  var bits = 0

  for( var i = 0; i < value.length; i++ ) {

    byte = value.charCodeAt( i ) - 63
    current = current | (( byte & 0x1F ) << bits )
    bits = bits + 5

    if( byte < 0x20 ) {
      if( ++values & 1 ) {
        x = sign( current )
      } else {
        y = sign( current )
        callback( x, y )
      }
      current = 0
      bits = 0
    }

  }

  return values
}

/**
 * Converts an encoded polyline string to an array of points.
 * @param {string} value The encoded polyline string
 * @returns {LatLngExpression[][]} An array of coordinates
 */
export default function decodePolyline( value:string ):LatLngExpression[][] {
  var points = []
  var lat = 0
  var lon = 0

  var values = integers( value, function( x:number, y:number ) {
    lat += x
    lon += y
    points.push([ lat / PRECISION, lon / PRECISION ])
  })

  return points

}