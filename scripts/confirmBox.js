function confirmCommand(params)
{
	const _default = {message: "Etes-vous certain(e) de vouloir continuer ?", yesLabel: "Oui", noLabel: "Non", yesFunction: () => undefined, noFunction: () => undefined};
	let parameters = {..._default, ...params};
	$('body').append('<div id="screenMask" style="position: absolute; left: 0px; top: 0px; width: 100%; height: 100%; background: black; opacity: 0.6; z-index: 20;"></div><div id="confirmBox" style="position: absolute; width: 400px; height: 120px; left: 22%; top: 40%; z-index: 21; color: black; overflow: hidden;"><label style="display: inline-block; width: 100%; height: 20px; background: tomato; font-weight: bold; font-family: Comfortaa; font-size: 80%; line-height: 1.5; padding-left: 4px;">Attention, cette action est irréversible !</label><div style="width: 100%; height: 100px; background: gainsboro;"><label style="position: absolute; left: 10px; top: 30px; line-height: 1;">' + parameters.message + '</label><div style="width: 100%; height: 60px; text-align: right; position: absolute; bottom: -30px; right: 10px;"><button style="margin-right: 6px;">' + parameters.yesLabel + '</button><button>' + parameters.noLabel + '</button></div></div></div>');
	const removeConfirmBox = () => $('#screenMask, #confirmBox').remove();
	$('#confirmBox button:first').on('click', () =>
		{
			removeConfirmBox();
			parameters.yesFunction();
		}
	);
	$('#confirmBox button:last').on('click', () =>
		{
			removeConfirmBox();
			parameters.noFunction();
		}
	);
}