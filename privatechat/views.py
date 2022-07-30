from email import message
from django.http import JsonResponse
from django.shortcuts import render
from django.contrib.auth import get_user_model
from .models import ChatModel
User = get_user_model()


def private_chat_home(request):
    users = User.objects.exclude(username=request.user.username)
    return render(request, 'chat.html', context={'users': users})

def chatPage(request, username):
    user_obj = User.objects.get(username=username)
    users = User.objects.exclude(username=request.user.username)
    if request.user.is_authenticated:

        if request.user.id > user_obj.id:
            thread_name = f'chat_{request.user.id}-{user_obj.id}'
        else:
            thread_name = f'chat_{user_obj.id}-{request.user.id}'
        message_objs = ChatModel.objects.filter(thread_name=thread_name)
        senders = {}
        send_messg = []
        for i, mesg in enumerate(message_objs):
            user_obj_temp = User.objects.get(id=mesg.sender)
            senders[user_obj_temp.id] = f"{user_obj_temp.username}"
            send_messg.append([f"{mesg.sender}", f"{mesg.message}", mesg.timestamp])
        return render(request, 'message.html', context={'user' : f"{user_obj.id}" ,'users': users, 'messages' : send_messg, 'username' : username, 'count' : len(send_messg)})
    else:
        return render(request, 'chat.html')