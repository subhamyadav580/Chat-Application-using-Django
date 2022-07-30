from django.db import models
from django.contrib.auth.models import User
from django.contrib.humanize.templatetags import humanize


# Create your models here.


class ChatModel(models.Model):
    sender = models.CharField(max_length=100, default=None)
    message = models.TextField(null=True, blank=True)
    thread_name = models.CharField(null=True, blank=True, max_length=50)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return self.message
    
    def get_date(self):
        return humanize.naturaltime(self.timestamp)
