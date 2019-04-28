from django.conf.urls import url

from profiles.views import SatFileUploadView, TextSatFilesView, TextSatFileView, MaxSatFileUploadView, TextMaxSatFilesView, TextMaxSatFileView, RegistrationView

urlpatterns = [
    url(r'^upload/sat/(?P<filename>[^/]+)/$', SatFileUploadView.as_view(), name='sat_file_upload'),
    url(r'^upload/maxsat/(?P<filename>[^/]+)/$', MaxSatFileUploadView.as_view(), name='maxsat_file_upload'),
    url(r'^files/sat/$', TextSatFilesView.as_view(), name='sat_files'),
    url(r'^files/maxsat/$', TextMaxSatFilesView.as_view(), name='maxsat_files'),
    url(r'^file/sat/(?P<pk>\d+)/(?P<vistype>\w+)/$', TextSatFileView.as_view(), name='sat_file'),
    url(r'^file/maxsat/(?P<pk>\d+)/(?P<vistype>\w+)/$', TextMaxSatFileView.as_view(), name='maxsat_file'),
    url(r'^register/$', RegistrationView.as_view(), name='user'),
]

