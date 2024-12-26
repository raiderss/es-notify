local function notifyAll(type, header, message, delay)
    TriggerClientEvent('TriggerNotification', -1, type, header, message) 
    Citizen.Wait(delay or 0)
end

RegisterCommand("announce", function(source, args, rawCommand)
    local header = args[1] or 'ANNOUNCE'  
    local message = table.concat(args, " ", 2) or 'No message provided.'  
    notifyAll('Success', header, message, 5000) 
end)