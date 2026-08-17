from django.contrib.auth.models import User
from rest_framework import serializers

from .models import Media


# =========================================
# MEDIA SERIALIZER
# =========================================

class MediaSerializer(serializers.ModelSerializer):

    class Meta:

        model = Media

        fields = [
            "id",
            "title",
            "type",
            "status",
            "rating",
            "poster",
            "owner",
        ]

        read_only_fields = [
            "id",
            "owner",
        ]


# =========================================
# REGISTER SERIALIZER
# =========================================

class RegisterSerializer(serializers.ModelSerializer):

    password = serializers.CharField(
        write_only=True,
        min_length=6
    )

    class Meta:

        model = User

        fields = [
            "username",
            "email",
            "password",
        ]

    def create(self, validated_data):

        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
        )

        return user