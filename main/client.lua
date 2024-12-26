local display = false

local function notify(type, header, message, delay)
    exports[GetCurrentResourceName()]:Notification(type, header, message)
    Citizen.Wait(delay or 0)
end

RegisterKeyMapping('Menu', 'Open Eyes Notification', 'keyboard', 'J')

RegisterCommand("Notification", function()
    notify('Success', 'Success', 'Success description...', 1000)
    notify('Error', 'Error', 'Error description...', 2000)
    notify('Instagram', 'Instagram', 'https://t3.ftcdn.net/jpg/05/82/71/66/360_F_582716670_ZvwnsgMro4Qf4OUzvH01TbPQDvoldniR.jpg', 5000)
    notify('Twitter', 'Twitter', 'Test message for Twitter...', 7000)
    notify('Instagram', 'Instagram', 'Test message for Instagram', 5000)
end)


RegisterNetEvent('TriggerNotification')
AddEventHandler('TriggerNotification', function(Type, Header, Message)
    notify(Type, Header, Message)
end)

exports('Notification', function(Type, Header, Message)
    SendNUIMessage({
        data = "NOTIFICATION",
        type = Type,
        header = Header,
        message = Message
    })
end)

RegisterCommand('Menu', function()
    SendNUIMessage({ data = "MENU" })
    SetDisplay(true, true)
end)

function SetDisplay(bool)
    display = bool
    SetNuiFocus(bool, bool)
    SendNUIMessage({ data = bool and "MENU" or nil })
end

RegisterCommand('Menu', function()
    SetDisplay(not display)
end)

RegisterNUICallback("exit", function(data)
    SetDisplay(false)
end)