Wymaganie:

zainstalowany Docker oraz Docker Compose.

instalacja Docker na Ubuntu 16.04:
    https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-16-04

instalacja Docker Compose:
    sudo apt install docker-compose
instalacja Nodejs i npm:
    sudo apt install nodejs
    sudo apt install npm

------------------------------------------

Aby uruchomić system:

Z poziomu folderu frontend/formulavis zbudować pliki frontendowe :
npm install
npm run build
następnie z poziomu folderu, w którym znajduje się plik docker-compose.yml:
    docker-compose up
lub
    sudo docker-compose up


------

- W przypadku błędu typu socket - należy wyłączyć inne działające serwisy np.:
    sudo service nginx stop
    sudo service postgres stop

- W przypadku błędu typu "version in ... unspported" - należy w pliku docker-compose.yml
zmienić wersje z '3' na '2'

- W przypadku błędu: wyłączenia się usługi nginx oraz frontend, należy:

    1. zastopować system: CTRL + C lub docker-compose stop

    2. w pliku docker-compose.yml w sekcji "frontend" dopisać opcje (przykład zapisu w sekcji backend):
        command: npm install --no-optional

    3. uruchomić system:
        docker-compose up

    4. system powinnien zainstalować odpowienie brakujące składniki oraz ponownie wywołać błąd aplikacji frontend.
       Należy wtedy go wyłączyć:
        docker-compose stop

    5. w pliku docker-compose.yml w sekcji "frontend" usunąć dopisaną wcześniej opcje

    6. uruchomić pownownie system:
        docker-compose up


------
Administrator
login: admin
password: admin

Po kilkudziesięciu sekundach w przeglądarce można wpisać (powinna pojawić się główna strona projektu):
    localhost

Lub do panelu administratora:
    localhost:8000/admin/



