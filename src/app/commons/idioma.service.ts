import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IdiomaService {

    idioma_seleccionado : any;

    seleccionar_idioma(idioma): void
    {
        let vm = this;
        vm.idioma_seleccionado = idioma;

        console.log("");
        console.log(" -------------- vm.idioma_seleccionado en el servicio compartido -------------- ");
        console.log(vm.idioma_seleccionado);
        console.log(" -------------- vm.idioma_seleccionado en el servicio compartido -------------- ");
        console.log("");
    }
    
    idioma_actual(idioma) : any 
    {
        let vm = this;
        return vm.idioma_seleccionado;
    }

    listaDeIdiomas(): any[]{
        return [
            /*{"indice": 0, "Heteroglotonimo": "Afrikáans", "Autoglotonimo": "afrikáans "},
            {"indice": 1, "Heteroglotonimo": "Albanés", "Autoglotonimo": "gjuha shqipë"},
            {"indice": 2, "Heteroglotonimo": "Alemán", "Autoglotonimo": "deutsch "},
            {"indice": 3, "Heteroglotonimo": "Amárico", "Autoglotonimo": "አማርኛ "},
            {"indice": 4, "Heteroglotonimo": "Árabe", "Autoglotonimo": "العربية", "dir":"rtl"},
            {"indice": 5, "Heteroglotonimo": "Armenio", "Autoglotonimo": "հայերեն լեզու "},
            {"indice": 6, "Heteroglotonimo": "Azerí", "Autoglotonimo": "Азәрбајҹан дили"},
            {"indice": 7, "Heteroglotonimo": "Bengalí", "Autoglotonimo": "বাংলা"},
            {"indice": 8, "Heteroglotonimo": "Bielorruso", "Autoglotonimo": "Беларуская"},
            {"indice": 9, "Heteroglotonimo": "Birmano", "Autoglotonimo": "မြန်မာ "},
            {"indice": 10, "Heteroglotonimo": "Bosnio", "Autoglotonimo": "bosanski jezik"},
            {"indice": 11, "Heteroglotonimo": "Búlgaro", "Autoglotonimo": "български"},
            {"indice": 12, "Heteroglotonimo": "Canarés", "Autoglotonimo": "ಕನ್ನಡ "},
            {"indice": 13, "Heteroglotonimo": "Catalán", "Autoglotonimo": "català"},
            {"indice": 14, "Heteroglotonimo": "Cebuano", "Autoglotonimo": "sugbuanon"},
            {"indice": 15, "Heteroglotonimo": "Checo", "Autoglotonimo": "Česky"},
            {"indice": 16, "Heteroglotonimo": "Chino (Simplificado)", "Autoglotonimo":   "汉语"},
            {"indice": 17, "Heteroglotonimo": "Chino (Tradicional)", "Autoglotonimo":  "漢語"},
            {"indice": 18, "Heteroglotonimo": "Cingalés", "Autoglotonimo": "සිංහල"},
            {"indice": 19, "Heteroglotonimo": "Coreano", "Autoglotonimo": "한국어"},
            {"indice": 20, "Heteroglotonimo": "Corso", "Autoglotonimo": "corsu"},
            {"indice": 21, "Heteroglotonimo": "Criollo", "Autoglotonimo": "kreyòl ayisyen"},
            {"indice": 22, "Heteroglotonimo": "Croata", "Autoglotonimo": "hrvatski"},
            {"indice": 23, "Heteroglotonimo": "Danés", "Autoglotonimo": "dansk"},
            {"indice": 24, "Heteroglotonimo": "Eslovaco", "Autoglotonimo": "slovenčina, slovenský jazyk"},
            {"indice": 25, "Heteroglotonimo": "Esloveno", "Autoglotonimo": "slovenščina"},*/
            {
                "indice": 26, "Heteroglotonimo": "Español", "Autoglotonimo": "Español",
                "Invalid_Title": "Título inválido",
                "Invalid_Year": "Año inválido",
                "Invalid_Date": "Fecha Inválida",
                "Welcome": "Bienvenido",
                "Search": "Buscar",
                "Order" : "Orden",
                "Ascending order": "Order ascendente",
                "Descending order": "Order descendente",
                "Save": "Guardar",
                "Cancel": "Cancelar",
                "Success": "Éxito",
                "Delete" : "Eliminar",
                "Event saved successfully.": "evento",
                "Warning": "Advertencia",
                "This action cannot be reversed.": "Esta acción no puede ser revertida.",
                "Remove": "Retirar",
                "Title": "Título",
                "Event": "Evento",
                "Year": "Año",
                "Month": "Mes",
                "Day": "Día",
                "Hour": "Hora",
                "Minute": "Minuto",
                "Second": "Segundo",
                "Add": "Agregar",
                "Select One": "Seleccione uno",
                "Months":[
                    { "value": 0, "name": "Enero" },
                    { "value": 1, "name": "Febrero" },
                    { "value": 2, "name": "Marzo" },
                    { "value": 3, "name": "Abril" },
                    { "value": 4, "name": "Mayo"  },
                    { "value": 5, "name": "Junio" },
                    { "value": 6, "name": "Julio" },
                    { "value": 7, "name": "Agosto" },
                    { "value": 8, "name": "Septiembre" },
                    { "value": 9, "name": "Octubre" },
                    { "value": 10, "name": "Noviembre" },
                    { "value": 11, "name": "Diciembre" }
                ],
                "Copy": "Copiar"
            },
            /*{"indice": 27, "Heteroglotonimo": "Esperanto", "Autoglotonimo": "Lingvo Internacia"},
            {"indice": 28, "Heteroglotonimo": "Estonio", "Autoglotonimo": "eesti keel"},
            {"indice": 29, "Heteroglotonimo": "Euskera", "Autoglotonimo": "Euskara"},
            {"indice": 30, "Heteroglotonimo": "Finés", "Autoglotonimo": "suomen kieli"},
            {"indice": 31, "Heteroglotonimo": "Francés", "Autoglotonimo": "Français"},
            {"indice": 32, "Heteroglotonimo": "Frisón", "Autoglotonimo": "Frysk, Friisk, Fräisk"},
            {"indice": 33, "Heteroglotonimo": "Gaélico", "Autoglotonimo": "Gàidhlig"},
            {"indice": 34, "Heteroglotonimo": "Galés", "Autoglotonimo": "Cymraeg"},
            {"indice": 35, "Heteroglotonimo": "Gallego", "Autoglotonimo": "Galego"},
            {"indice": 36, "Heteroglotonimo": "Georgiano", "Autoglotonimo": "ქართული"},
            {"indice": 37, "Heteroglotonimo": "Griego", "Autoglotonimo": "Ελληνικά"},
            {"indice": 38, "Heteroglotonimo": "Guyaratí", "Autoglotonimo": "ગુજરાતી"},
            {"indice": 39, "Heteroglotonimo": "Hausa", "Autoglotonimo": "Hausa "},
            {"indice": 40, "Heteroglotonimo": "Hawaiano", "Autoglotonimo": "‘Ōlelo Hawai‘i"},
            {"indice": 41, "Heteroglotonimo": "Hebreo", "Autoglotonimo": "עִבְרִית ", "dir":"rtl"},
            {"indice": 42, "Heteroglotonimo": "Hindi", "Autoglotonimo": "हिन्दी"},
            {"indice": 43, "Heteroglotonimo": "Hmong", "Autoglotonimo": "Hmong "},
            {"indice": 44, "Heteroglotonimo": "Húngaro", "Autoglotonimo": "magyar "},
            {"indice": 45, "Heteroglotonimo": "Igbo", "Autoglotonimo": "asụsụ Ndi Igbo"},
            {"indice": 46, "Heteroglotonimo": "Indonesio", "Autoglotonimo": "bahasa Indonesia"},*/
            {
                "indice": 47, "Heteroglotonimo": "Inglés", "Autoglotonimo": "English",
                "Invalid_Title": "Invalid Title",
                "Invalid_Year": "Invalid Year",
                "Invalid_Date": "Invalid Date",
                "Welcome": "Welcome",
                "Search": "Search",
                "Order" : "Order",
                "Ascending order": "Ascending order",
                "Descending order": "Descending order",
                "Save": "Save",
                "Cancel": "Cancel",
                "Success": "Success",
                "Delete" : "Delete",
                "Event saved successfully.": "Event saved successfully.",
                "Warning": "Warning",
                "This action cannot be reversed.": "This action cannot be reversed.",
                "Remove": "Remove",
                "Title": "Title",
                "Event": "Event",
                "Year": "Year",
                "Month": "Month",
                "Day": "Day",
                "Hour": "Hour",
                "Minute": "Minute",
                "Second": "Second",
                "Add": "Add",
                "Select One": "Select One",
                "Months":[
                    { "value": 0, "name": "January" },
                    { "value": 1, "name": "February"},
                    { "value": 2, "name": "March" },
                    { "value": 3, "name": "April" },
                    { "value": 4, "name": "May"  },
                    { "value": 5, "name": "June" },
                    { "value": 6, "name": "July" },
                    { "value": 7, "name": "August" },
                    { "value": 8, "name": "September" },
                    { "value": 9, "name": "October" },
                    { "value": 10, "name": "November" },
                    { "value": 11, "name": "December" }
                ],
                "Copy": "Copy"
            },
            /*{"indice": 48, "Heteroglotonimo": "Irlandés", "Autoglotonimo": "Gaeilge"},
            {"indice": 49, "Heteroglotonimo": "Islandés", "Autoglotonimo": "íslenska"},
            {"indice": 50, "Heteroglotonimo": "Italiano", "Autoglotonimo": "italiano "},
            {"indice": 51, "Heteroglotonimo": "Japonés", "Autoglotonimo": "日本語"},
            {"indice": 52, "Heteroglotonimo": "Javanés", "Autoglotonimo": "Basa Jawa, Basa Jawi"},
            {"indice": 53, "Heteroglotonimo": "Jemer", "Autoglotonimo": "ខ្មែរ។ "},
            {"indice": 54, "Heteroglotonimo": "Kazajo", "Autoglotonimo": "Қазақ тілі"},
            {"indice": 55, "Heteroglotonimo": "Kirguís", "Autoglotonimo": "кыргыз тили"},
            {"indice": 56, "Heteroglotonimo": "Kurdo", "Autoglotonimo": "Kurdî"},
            {"indice": 57, "Heteroglotonimo": "Lao", "Autoglotonimo": "ພາສາລາວ"},
            {"indice": 58, "Heteroglotonimo": "Latín", "Autoglotonimo": "latinō"},
            {"indice": 59, "Heteroglotonimo": "Letón", "Autoglotonimo": "Latviešu valoda"},
            {"indice": 60, "Heteroglotonimo": "Lituano", "Autoglotonimo": "Lietuvių kalba"},
            {"indice": 61, "Heteroglotonimo": "Luxemburgués", "Autoglotonimo": "Lëtzebuergesch"},
            {"indice": 62, "Heteroglotonimo": "Macedonio", "Autoglotonimo": "Македонски"},
            {"indice": 63, "Heteroglotonimo": "Malayalam", "Autoglotonimo": "മലയാളം"},
            {"indice": 64, "Heteroglotonimo": "Malayo", "Autoglotonimo": "Bahasa Melayu"},
            {"indice": 65, "Heteroglotonimo": "Malgache", "Autoglotonimo": "Malagasy"},
            {"indice": 66, "Heteroglotonimo": "Maltés", "Autoglotonimo": "l-ilsien Malti"},
            {"indice": 67, "Heteroglotonimo": "Maorí", "Autoglotonimo": "reo māori"},
            {"indice": 68, "Heteroglotonimo": "Maratí", "Autoglotonimo":  "मराठी"},
            {"indice": 69, "Heteroglotonimo": "Mongol", "Autoglotonimo": "Монгол"},
            {"indice": 70, "Heteroglotonimo": "Neerlandés", "Autoglotonimo": "Nederlands"},
            {"indice": 71, "Heteroglotonimo": "Nepalí", "Autoglotonimo": "नेपाली"},
            {"indice": 72, "Heteroglotonimo": "Noruego", "Autoglotonimo": "Norsk"},
            {"indice": 73, "Heteroglotonimo": "Nyanja", "Autoglotonimo": "chinyanja / chicheŵa"},
            {"indice": 74, "Heteroglotonimo": "Panyabí", "Autoglotonimo": "ਪੰਜਾਬੀ"},
            {"indice": 75, "Heteroglotonimo": "Pastún", "Autoglotonimo": "پښتو", "dir":"rtl"},
            {"indice": 76, "Heteroglotonimo": "Persa", "Autoglotonimo": "فارسی", "dir":"rtl"},
            {"indice": 77, "Heteroglotonimo": "Polaco", "Autoglotonimo": "Polski"},
            {"indice": 78, "Heteroglotonimo": "Portugués", "Autoglotonimo": "Português"},
            {"indice": 79, "Heteroglotonimo": "Rumano", "Autoglotonimo": "românesc"},
            {"indice": 80, "Heteroglotonimo": "Ruso", "Autoglotonimo": "Русский язык"},
            {"indice": 81, "Heteroglotonimo": "Samoano", "Autoglotonimo": "gagana Samoa"},
            {"indice": 82, "Heteroglotonimo": "Serbio", "Autoglotonimo": "Cрпски / Srpski"},
            {"indice": 83, "Heteroglotonimo": "Shona", "Autoglotonimo": "Shona"},
            {"indice": 84, "Heteroglotonimo": "Sindhi", "Autoglotonimo": "سنڌي ", "dir":"rtl"},
            {"indice": 85, "Heteroglotonimo": "Somalí", "Autoglotonimo": "Af-Soomaali"},
            {"indice": 86, "Heteroglotonimo": "Sotho", "Autoglotonimo": "seSotho"},
            {"indice": 87, "Heteroglotonimo": "Suajili", "Autoglotonimo": "Kiswahili"},
            {"indice": 88, "Heteroglotonimo": "Sueco", "Autoglotonimo": "Svenska"},
            {"indice": 89, "Heteroglotonimo": "Sundanés", "Autoglotonimo": "basa Sunda"},
            {"indice": 90, "Heteroglotonimo": "Tagalo", "Autoglotonimo": "Wikang tagalog"},
            {"indice": 91, "Heteroglotonimo": "Tailandé*s", "Autoglotonimo":  "ภาษาไทย"},
            {"indice": 92, "Heteroglotonimo": "Tamil", "Autoglotonimo": "தமிழ்"},
            {"indice": 93, "Heteroglotonimo": "Tayiko", "Autoglotonimo": "Тоҷикӣ / Todžikī"},
            {"indice": 94, "Heteroglotonimo": "Telugu", "Autoglotonimo": "తెలుగు"},
            {"indice": 95, "Heteroglotonimo": "Turco", "Autoglotonimo": "Türkçe, türk dili"},
            {"indice": 96, "Heteroglotonimo": "Ucraniano", "Autoglotonimo": "Українська мова / Ukraïns'ka mova"},
            {"indice": 97, "Heteroglotonimo": "Urdu", "Autoglotonimo": "اردو۔",  "dir":"rtl"},
            {"indice": 98, "Heteroglotonimo": "Uzbeko", "Autoglotonimo": "O'zbek"},
            {"indice": 99, "Heteroglotonimo": "Vietnamita", "Autoglotonimo": "Tiếng việt nam"},
            {"indice": 100, "Heteroglotonimo": "Xhosa", "Autoglotonimo": "IsiXhosa"},
            {"indice": 101, "Heteroglotonimo": "Yidis", "Autoglotonimo": 'ייִדיש  ', 'dir':"rtl"},
            {"indice": 102, "Heteroglotonimo": "Yoruba", "Autoglotonimo": "Èdèe yorùbá"},
            {"indice": 103, "Heteroglotonimo": "Zulú", "Autoglotonimo": "IsiZulu "}*/
        ]
    } 

    constructor() { }
}
