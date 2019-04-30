from django.http.response import Http404
from django.contrib.auth.models import User, update_last_login
from rest_framework import status
from rest_framework.generics import ListAPIView, DestroyAPIView, RetrieveAPIView, CreateAPIView
from rest_framework.permissions import AllowAny
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_jwt.views import ObtainJSONWebToken

from profiles.models import Profile, TextFile
from profiles.serializers import TextFileSerializer, TextFileSerializerDetail, UserSerializer
import requests

def get_profile(user):
    return Profile.objects.get_or_create(user=user)[0]

class RegistrationView(CreateAPIView):
    model = User
    permission_classes = (AllowAny,)
    serializer_class = UserSerializer

    def post(self, request):

        if not ('recaptcha' in request.data and 'username' in request.data and 'password' in request.data):
            return Response(status=400)

        recaptcha_response = request.data['recaptcha']

        recaptcha_result = requests.post(
            "https://www.google.com/recaptcha/api/siteverify",
            data={
                'secret': "6LeWIqEUAAAAABN_-9wZx0GfWl4egIBQpvbYmwx9",
                'response': recaptcha_response
            }
        ).json().get("success",False)

        if not recaptcha_result:
            return Response(status=400)

        user = User.objects.create_user(
            username=request.data['username'],
            password=request.data['password'])
        user.save()

        return Response(status=200)


class SatFileUploadView(APIView):
    parser_classes = (MultiPartParser,)

    def put(self, request, filename):
        file_obj = request.FILES['file']

        current_user = request.user
        profile = get_profile(current_user)

        TextFile.objects.get_or_create(
            name=filename,
            profile=profile,
            content=file_obj,
            kind='sat'
        )

class MaxSatFileUploadView(APIView):
    parser_classes = (MultiPartParser,)

    def put(self, request, filename):
        file_obj = request.FILES['file']

        current_user = request.user
        profile = get_profile(current_user)

        TextFile.objects.get_or_create(
            name=filename,
            profile=profile,
            content=file_obj,
            kind='maxsat'
        )

        return Response(status=204)


class TextSatFilesView(ListAPIView):
    serializer_class = TextFileSerializer

    def get_queryset(self):
        current_user = self.request.user
        profile = get_profile(current_user)

        return TextFile.objects.filter(profile=profile, kind='sat')

class TextMaxSatFilesView(ListAPIView):
    serializer_class = TextFileSerializer

    def get_queryset(self):
        current_user = self.request.user
        profile = get_profile(current_user)

        return TextFile.objects.filter(profile=profile, kind='maxsat')


class TextSatFileView(DestroyAPIView, RetrieveAPIView):
    queryset = TextFile.objects.all()
    serializer_class = TextFileSerializerDetail

    def delete(self, request, *args, pk=None, vistype=None, **kwargs):
        current_user = self.request.user
        profile = get_profile(current_user)
        try:
            text_file = TextFile.objects.get(pk=pk, profile=profile)
        except TextFile.DoesNotExist:
            raise Http404
        text_file.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class TextMaxSatFileView(DestroyAPIView, RetrieveAPIView):
    queryset = TextFile.objects.all()
    serializer_class = TextFileSerializerDetail

    def delete(self, request, *args, pk=None, vistype=None, **kwargs):
        current_user = self.request.user
        profile = get_profile(current_user)
        try:
            text_file = TextFile.objects.get(pk=pk, profile=profile)
        except TextFile.DoesNotExist:
            raise Http404
        text_file.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ObtainLoginTokenView(ObtainJSONWebToken):
    def post(self, request):

        if not ('recaptcha' in request.data and 'username' in request.data and 'password' in request.data):
            return Response(status=400)

        recaptcha_response = request.data['recaptcha']

        recaptcha_result = requests.post(
            "https://www.google.com/recaptcha/api/siteverify",
            data={
                'secret': "6LeWIqEUAAAAABN_-9wZx0GfWl4egIBQpvbYmwx9",
                'response': recaptcha_response
            }
        ).json().get("success",False)

        if not recaptcha_result:
            return Response(status=400)

        result = super(ObtainLoginTokenView, self).post(request)
        user = User.objects.get(username = request.data['username'])
        update_last_login(None, user)           
        return result