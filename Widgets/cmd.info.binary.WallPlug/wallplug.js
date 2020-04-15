const defaultSettings =
{
    imgOn: "/plugins/widget/core/template/dashboard/cmd.info.binary.WallPlug/on.png",
    imgOff: "/plugins/widget/core/template/dashboard/cmd.info.binary.WallPlug/off.png"
};
export function register(id)
{
    const widget = document.querySelector(`[data-cmd_id="${id}"]`)
    let { imgOn, imgOff, idOn, idOff, state, eqlogic_id: eqlogicId } = { ...defaultSettings, ...widget.dataset };
    let actions;
    function getAction(action)
    {
        if (action && is_numeric(idOn))
        {
            return Promise.resolve(+idOn);
        }
        else if (!action && is_numeric(idOff))
        {
            return Promise.resolve(+idOff);
        }
        else
        {
            return new Promise(success =>
            {
                function result(r)
                {
                    actions = r;
                    let result = r.find(a => jeedom.cmd.normalizeName(a.name) === (action ? 'on' : 'off'));
                    success(result && result.id);
                }

                if (actions)
                {
                    result(actions);
                }
                else
                {
                    jeedom.eqLogic.getCmd({ id: +eqlogicId, success: result });
                }
            });
        }
    }

    const img = widget.querySelector('img');
    jeedom.cmd.update[id] = function (options)
    {
        state = +options.value;
        img.src = state ? imgOn : imgOff;
    }

    jeedom.cmd.update[id]({ value: state });
    img.src = state ? imgOn : imgOff;
    img.addEventListener('click', async function ()
    {
        var id = await getAction(!state);
        if (id)
        {
            jeedom.cmd.execute({ id });
        }
    })
}