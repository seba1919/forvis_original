from rest_framework import serializers

from profiles.models import TextFile, JsonFile, FORMATS
from .tasks import create_json


class TextFileSerializer(serializers.ModelSerializer):
    url = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = TextFile
        fields = ('id', 'name', 'url', 'minimized')

    def get_url(self, obj):
        return obj.content.url


class TextFileSerializerDetail(TextFileSerializer):
    content = serializers.SerializerMethodField(read_only=True)

    class Meta(TextFileSerializer.Meta):
        fields = TextFileSerializer.Meta.fields + ('content',)

    def get_content(self, obj):
        msg = ""

        chosen_format = self.context['view'].kwargs.get('vistype')
        selected_vars = [int(x) for x in self.context['request'].query_params.getlist('selectedVariables', None)]
        c = (chosen_format, chosen_format)
        if c in FORMATS:
            json_file, j_c = JsonFile.objects.get_or_create(
                text_file=obj,
                json_format=chosen_format,
                selected_vars=selected_vars
            )
            status = json_file.status

            if status == 'empty':
                create_json.delay(obj.id, json_file.id, json_file.json_format, selected_vars)
                msg = "Formatting started."

            if status == 'pending':
                msg = "Formatting in progress."

            if status == 'done':
                return dict(data=json_file.content)
        else:
            msg = 'Format not supported.'

        data = {
            "message": msg
        }

        return dict(data=data)
