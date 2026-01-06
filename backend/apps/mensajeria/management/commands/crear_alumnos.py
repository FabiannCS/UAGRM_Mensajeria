from django.core.management.base import BaseCommand
from faker import Faker
from apps.mensajeria.models import Estudiante
import random

class Command(BaseCommand):
    help = 'Genera estudiantes falsos para pruebas'

    def handle(self, *args, **kwargs):
        fake = Faker('es_MX') # Genera nombres en español
        self.stdout.write("Generando estudiantes falsos...")

        # 1. Crear TU usuario real para pruebas (si no existe)
        # CAMBIA ESTE NÚMERO POR EL TUYO QUE REGISTRASTE EN EL SANDBOX DE WHATSAPP
        mi_numero = "59177777777" 
        
        if not Estudiante.objects.filter(celular=mi_numero).exists():
            Estudiante.objects.create(
                nombre="Yo",
                apellido="Developer",
                celular=mi_numero,
                carrera="Ingeniería de Sistemas",
                activo=True
            )
            self.stdout.write(self.style.SUCCESS(f'Usuario Real creado: {mi_numero}'))

        # 2. Crear 50 estudiantes falsos
        carreras = ['Derecho', 'Medicina', 'Arquitectura', 'Sistemas', 'Economía']
        
        for _ in range(50):
            # Generamos un número falso que empiece con 591
            numero_random = f"591{random.randint(60000000, 79999999)}"
            
            # Evitar duplicados
            if not Estudiante.objects.filter(celular=numero_random).exists():
                Estudiante.objects.create(
                    nombre=fake.first_name(),
                    apellido=fake.last_name(),
                    celular=numero_random,
                    carrera=random.choice(carreras),
                    activo=random.choice([True, True, True, False]) # 75% probabilidad de estar activo
                )

        self.stdout.write(self.style.SUCCESS('¡Éxito! Se crearon estudiantes de prueba.'))