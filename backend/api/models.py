from django.db import models

class GreenAction(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    points = models.IntegerField(default=10)
    category = models.CharField(max_length=100) # e.g. "Recycling", "Energy"
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title