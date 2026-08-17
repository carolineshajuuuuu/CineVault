from django.db import models
from django.contrib.auth.models import User


class Media(models.Model):

    MEDIA_TYPES = [
        ("Movie", "Movie"),
        ("TV", "TV"),
    ]

    STATUS_CHOICES = [
        ("Watched", "Watched"),
        ("Unwatched", "Unwatched"),
    ]

    title = models.CharField(max_length=200)

    type = models.CharField(
        max_length=10,
        choices=MEDIA_TYPES
    )

    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default="Unwatched"
    )

    rating = models.IntegerField(
        null=True,
        blank=True
    )

    poster = models.ImageField(
        upload_to="posters/",
        null=True,
        blank=True
    )

    owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="media"
    )

    def __str__(self):
        return self.title