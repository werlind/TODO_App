FROM python:3.10-slim

# Ustawienie katalogu roboczego
WORKDIR /app

# Kopiowanie pliku requirements.txt i instalacja zależności
COPY requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Kopiowanie reszty aplikacji
COPY . .

# Uruchomienie aplikacji za pomocą Gunicorn na porcie 8000
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:8000", "app:app"]
