
import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from channels.db import database_sync_to_async
from .models import ChatModel
from django.contrib.auth.models import User

class PersonalChatConsumer(WebsocketConsumer):
    def connect(self):
        my_id = self.scope['user'].id
        other_user_id = self.scope['url_route']['kwargs']['id']
        if int(my_id) > int(other_user_id):
            self.room_name = f'{my_id}-{other_user_id}'
        else:
            self.room_name = f'{other_user_id}-{my_id}'

        self.room_group_name = 'chat_%s' % self.room_name

        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )
        self.accept()

    def receive(self, text_data=None, bytes_data=None):
        data = json.loads(text_data)
        message = data['message']
        username = data['username']
        data_base = self.save_message(username, self.room_group_name, message)
        print("This is a database output", data_base)
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'username': username,
            }
        )
    def chat_message(self, event):
        message = event['message']
        user_id = event['username']
        user_obj = User.objects.get(id=user_id)
        self.send(text_data=json.dumps({
            'message': message,
            'username' : user_obj.username,
            'user_id': user_id
        }))
        print(f"{user_obj.username} : Messaage sent")

    def disconnect(self, code):
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )

    # @database_sync_to_async is used with asynchronous code
    def save_message(self, username, thread_name, message):
        print("Message going to saved")
        new_message = ChatModel.objects.create(
            sender=username, message=message, thread_name=thread_name)
        new_message.save()
        return "Succes"
