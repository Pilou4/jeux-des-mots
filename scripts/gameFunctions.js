function guid()
{
	var group = function (charNumber)
				{
					var result = "";
					for (var t = 0; t < charNumber; t++)
					{
						// result += codes.split("")[parseInt(Math.random() * codes.length)];
						result += (crypto.getRandomValues(new Uint8Array(1))[0] % 16).toString(16);
					}
					return result;
				};
	return group(8) + "-" + group(4) + "-" + group(4) + "-" + group(4) + "-" + group(12);
}

function cartesianToPolar (x1, y1, x2, y2)
{
	var x = x2 - x1;
	var y = y2 - y1;
	return 	{
				distance : Math.sqrt((x * x) + (y * y)),
				angle : -(Math.atan2(x, y) * 180 / Math.PI)
			};
}

function polarToCartesian (distance, angle)
{
	return 	{
				left: distance * Math.cos(angle),
				top: distance * Math.sin(angle)
			};
}