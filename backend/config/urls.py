from django.contrib import admin
from django.urls import path
from strawberry.django.views import GraphQLView
from django.views.decorators.csrf import csrf_exempt
import strawberry

# Importamos los esquemas de nuestras apps
from apps.mensajeria.graphql.schema import Query as MensajeriaQuery
from apps.mensajeria.graphql.schema import Mutation as MensajeriaMutation

# Combinamos todo en un Esquema Global
@strawberry.type
class Query(MensajeriaQuery):
    pass

@strawberry.type
class Mutation(MensajeriaMutation):
    pass

schema = strawberry.Schema(query=Query, mutation=Mutation)

urlpatterns = [
    path('admin/', admin.site.urls),
    # Esta es la ruta mágica para la API
    path('graphql/', csrf_exempt(GraphQLView.as_view(schema=schema))),
]