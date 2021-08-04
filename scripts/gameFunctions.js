function guid()
{
	let group = function (charNumber)
	{
		let result = "";
		for (let t = 0; t < charNumber; t++)
		{
			result += (crypto.getRandomValues(new Uint8Array(1))[0] % 16).toString(16);
		}
		return result;
	};
	return group(8) + "-" + group(4) + "-" + group(4) + "-" + group(4) + "-" + group(12);
}

function cartesianToPolar (x1, y1, x2, y2)
{
	let x = x2 - x1;
	let y = y2 - y1;
	return {
		distance : Math.sqrt((x * x) + (y * y)),
		angle : -(Math.atan2(x, y) * 180 / Math.PI)
	};
}

function polarToCartesian (distance, angle)
{
	return {
		left: distance * Math.cos(angle),
		top: distance * Math.sin(angle)
	};
}