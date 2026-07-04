FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY ["ChatApp.API.csproj", "."]
RUN dotnet restore "./ChatApp.API.csproj"
COPY . .
RUN dotnet build "./ChatApp.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "./ChatApp.API.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "ChatApp.API.dll"]