from django.contrib import admin
from django.urls import path, include
from strawberry.django.views import GraphQLView
from django.views.decorators.csrf import csrf_exempt
import strawberry
from rest_framework_simplejwt.views import ( TokenObtainPairView, TokenRefreshView, )

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
    
    path('api/mensajeria/', include('apps.mensajeria.urls')),

    path('graphql/', csrf_exempt(GraphQLView.as_view(schema=schema))),

    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'), # Login
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'), # Renovar
    
]