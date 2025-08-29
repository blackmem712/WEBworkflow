from django.core.management.base import BaseCommand
from django.contrib.auth.models import Group

class Command(BaseCommand):
    help = "Cria grupos padrão: Tecnico (TC), Gerente (GE), Recepcao (RC)."

    def handle(self, *args, **options):
        for name in ["Tecnico", "Gerente", "Recepcao"]:
            Group.objects.get_or_create(name=name)
        self.stdout.write(self.style.SUCCESS("Grupos criados/verificados."))
