from django.http.response import Http404, JsonResponse
from rest_framework import status
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView, DestroyAPIView, RetrieveAPIView

from profiles.models import Profile, TextFile
from profiles.serializers import TextFileSerializer, TextFileSerializerDetail


def get_profile(user):
    return Profile.objects.get_or_create(user=user)[0]


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


