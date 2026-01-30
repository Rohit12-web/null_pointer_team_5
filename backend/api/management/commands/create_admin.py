from django.core.management.base import BaseCommand
from api.models import User


class Command(BaseCommand):
    help = 'Create a superuser if it does not exist'

    def handle(self, *args, **options):
        email = 'admin@leafit.com'
        username = 'admin'
        password = 'Admin@123456'
        
        if User.objects.filter(email=email).exists():
            self.stdout.write(self.style.WARNING(f'Superuser {email} already exists'))
            # Ensure the user is a superuser
            user = User.objects.get(email=email)
            if not user.is_superuser:
                user.is_superuser = True
                user.is_staff = True
                user.set_password(password)
                user.save()
                self.stdout.write(self.style.SUCCESS(f'Updated {email} to superuser'))
        else:
            User.objects.create_superuser(
                email=email,
                username=username,
                name='Admin',
                password=password
            )
            self.stdout.write(self.style.SUCCESS(f'Superuser {email} created successfully'))
