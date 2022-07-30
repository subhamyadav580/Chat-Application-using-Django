from os import stat
from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path('', views.private_chat_home, name='home'),
    path('<str:username>/', views.chatPage, name='second_chat'),


]