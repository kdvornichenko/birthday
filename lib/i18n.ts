import { useLangStore } from "@/store/lang.store"
import { TFormFieldsTranslation } from "@/types/form.type";

type TranslationLang = {
    guests: string;
    where: string;
    address: { placeText1: string; atAddress: string; addressText: string; hallName: string };
    dressCode: string;
    suit: string;
    whiteColor: string;
    plan: { time: string; text: string }[];
    details: {
        warmWishes: string;
        organizerHelp: string;
        noFlowers: string;
        nekoName: string;
        nekoGift: string;
    };
    quetionaireTitle: string;
    form: {
        sendButton: string;
        errorsTitle: string;
        fieldErrors: Record<string, string>;
        items: TFormFieldsTranslation;
    };
    formSendedModal: {
        success: string;
        successAttendedTitle: string;
        successNotAttendedTitle: string;
        successAttendedHelp: string;
        successAttendedOrganizer: string;
        successNotAttendedHelp: string;
        error: string;
        errorCopyInstruction: string;
        errorNote: string;
        errorScreenshot: string
    }
}

export type Translations = {
    RU: TranslationLang;
    EN: TranslationLang
};

const translations = {
    RU: {
        guests: `Один день в этом году станет для нас особенно важным, и мы хотим провести его в кругу близких и друзей! <br />С большим удовольствием приглашаем Вас на нашу свадьбу!`,
        address: {
            placeText1: 'Наш праздник пройдет в ресторане "Русская рыбалка"',
            atAddress: 'По адресу:',
            addressText: 'Пос. Комарово, Приморское шоссе, 452 А',
            hallName: 'банкетный зал "Летний"',
        },
        dressCode: 'Мы будем признательны, если вы поддержите цветовую гамму нашей свадьбы в своих нарядах',
        suit: 'P.S. Костюм не обязателен',
        whiteColor: 'P.S.S. Пожалуйста, воздержитесь от&nbsp;использования принтов и& nbsp; белого цвета',
        plan: [
            { time: '16:00', text: 'Сбор гостей' },
            { time: '17:00', text: 'Свадебная церемония' },
            { time: '17:30', text: 'Банкет' },
            { time: '21:00', text: 'Торт' },
            { time: '22:00', text: 'Завершение вечера' },
        ],
        details: {
            warmWishes: `Свои тёплые слова и&nbsp;пожелания приносите в&nbsp;сердцах, а&nbsp;подарки&nbsp;&mdash; в конверте`,
            organizerHelp: `Если вы&nbsp;заблудились, готовите сюрприз или у&nbsp;вас появились какие-либо вопросы, вам с&nbsp;радостью поможет наш замечательный организатор&nbsp;&mdash; `,
            noFlowers: `P.S. Пожалуйста, не&nbsp;дарите нам цветы. Если вы&nbsp;хотите сделать нам комплимент, замените букет игрушкой или лакомством для`,
            nekoName: `Неко`,
            nekoGift: `P.S.S. Если решите подарить что-то для Неко, пожалуйста, напишите нам заранее &lt;3`,
        },
        quetionaireTitle: 'Пожалуйста, заполните данную анкету',
        form: {
            sendButton: 'Отправить',
            errorsTitle: 'Форма заполнена не полностью:',
            fieldErrors: {
                attendance: 'Выберите один из вариантов',
                transport: 'Выберите способ транспорта',
                coupleName: 'Заполните имя вашей половинки',
                alcohol: 'Выберите хотя бы один напиток',
                name: 'Заполните Имя',
                surname: 'Заполните Фамилию',
                allergies: 'Заполните аллергены',
                phone: 'Введите номер телефона',
                about: 'Заполните немного информации "О себе"',
            },
            items: {
                name: 'Имя',
                surname: 'Фамилия',
                attendance: {
                    label: 'Придете?',
                    options: {
                        solo: 'Приду',
                        nope: 'Не приду :(',
                    },
                },
                transport: {
                    label: 'Как планируете добираться до места свадьбы?',
                    options: {
                        transfer: 'На нашем трансфере',
                        self: 'Самостоятельно',
                    },
                },
                meal: {
                    label: 'Мясо/Рыба',
                    options: {
                        beef: 'Мясо',
                        fish: 'Рыба',
                    },
                },
                alcohol: {
                    label: 'Алкоголь?',
                    options: {
                        'red-dry': 'Красное сухое',
                        'red-semi-sweet': 'Красное полусухое',
                        'white-dry': 'Белое сухое',
                        'white-semi-sweet': 'Белое полусухое',
                        champaign: 'Шампанское',
                        nope: 'Не пью',
                    },
                },
                allergies: {
                    label: 'Есть ли у вас аллергия?',
                    options: {
                        yeap: 'Да',
                        nope: 'Нет',
                    },
                    textarea: 'Перечислите ваши аллергены',
                },
                phone: 'Введите ваш номер телефона',
                telegram: 'Введите ваш ник в telegram (если пользуетесь)',
                about:
                    'Расскажите что-нибудь о себе, какой-то интересный факт или что вы любите/не любите ❤️',
            },
        },
        formSendedModal: {
            success: 'Ответы отправлены!',
            successAttendedTitle: 'Спасибо! С нетерпением ждем Вас на свадьбе!',
            successNotAttendedTitle: 'Очень жаль 😢',
            successAttendedHelp: 'Если есть вопросы насчет свадьбы или хотите что-то поменять в ответах, то пишите нам',
            successAttendedOrganizer: 'Если есть что-то, о чем нам знать не надо, то можете пошушукаться с нашим организатором',
            successNotAttendedHelp: 'Если передумаете, напишите нам',
            error: 'Ошибка при отправке формы',
            errorCopyInstruction: 'Ошибка при отправке формы. Пожалуйста, скопируйте это сообщение, нажав на значок ',
            errorNote: 'Да-да, мне впадлу было делать логирование и привязывать какую-то БД',
            errorScreenshot: '(или сделайте скриншот) и отправьте мне'

        }

    },
    EN: {
        guests: `This year one day  will be especially important for us, and we want to spend it with our family and friends! <br /> It is with great pleasure that we invite you to our wedding!`,
        address: {
            placeText1: 'Our ceremony will be&nbsp;held at&nbsp;the "Russian fishing" restaurant',
            atAddress: 'Address: ',
            addressText: 'Komarovo settlement, Primorskoe highway, 452 A',
            hallName: 'banquet hall "Letny"',
        },
        dressCode: 'We&nbsp;would appreciate it&nbsp;if&nbsp;you support the color scheme of&nbsp;our wedding in&nbsp;your outfits',
        suit: `P.S. Suits are not necessary`,
        whiteColor: 'P.S.S. Please refrain from the use of&nbsp;prints and white color',
        plan: [
            { time: '16:00', text: 'Guest Gathering' },
            { time: '17:00', text: 'Wedding Ceremony' },
            { time: '17:30', text: 'Banquet' },
            { time: '21:00', text: 'Cake' },
            { time: '22:00', text: 'End of the Evening' },
        ],
        details: {
            warmWishes: `Bring your warm wishes in&nbsp;hearts and gifts in&nbsp;an&nbsp;envelope`,
            organizerHelp: `If you are lost, have any questions or are preparing a&nbsp;surprise, our wonderful organizer will be happy to help you&nbsp;&mdash; `,
            noFlowers: `P.S. Please do not give us flowers. If you want to compliment us, replace the bouquet with a toy or a treat for`,
            nekoName: `Neko`,
            nekoGift: `P.S.S. If you decide to donate something for Neko, please write to us in advance &lt;3`,
        },
        quetionaireTitle: 'Please fill out this questionnaire',
        form: {
            sendButton: 'Send',
            errorsTitle: 'The form is incomplete:',
            fieldErrors: {
                attendance: 'Please select one of the options',
                transport: 'Please select a mode of transport',
                coupleName: 'Please enter the name of your partner',
                alcohol: 'Please select at least one drink',
                name: 'Please enter your first name',
                surname: 'Please enter your surname',
                allergies: 'Please enter your allergies',
                phone: 'Please enter your phone number',
                about: 'Please fill in some information "About yourself"',
            },
            items: {
                name: 'First Name',
                surname: 'Last Name',
                attendance: {
                    label: 'Will you come?',
                    options: {
                        solo: 'I will come',
                        nope: "I won't come :(",
                    },
                },
                transport: {
                    label: 'How do you plan to get to the venue?',
                    options: {
                        transfer: 'On our transfer',
                        self: 'Independently',
                    },
                },
                meal: {
                    label: 'Meat/Fish',
                    options: {
                        beef: 'Meat',
                        fish: 'Fish',
                    },
                },
                alcohol: {
                    label: 'Alcohol?',
                    options: {
                        'red-dry': 'Red dry',
                        'red-semi-sweet': 'Red semi-sweet',
                        'white-dry': 'White dry',
                        'white-semi-sweet': 'White semi-sweet',
                        champaign: 'Champagne',
                        nope: "I don't drink",
                    },
                },
                allergies: {
                    label: 'Do you have any allergies?',
                    options: {
                        yeap: 'Yes',
                        nope: 'No',
                    },
                    textarea: 'List your allergens',
                },
                phone: 'Enter your phone number',
                telegram: 'Enter your telegram nickname (if you use it)',
                about: 'Tell us something about yourself, a fun fact, or your likes/dislikes ❤️',
            },
        },
        formSendedModal: {
            success: 'Answers have been sent!',
            successAttendedTitle: 'Thank you! We look forward to seeing you at the wedding!',
            successNotAttendedTitle: 'Very sorry 😢',
            successAttendedHelp: 'If you have any questions about the wedding or want to change your answers, please contact us',
            successAttendedOrganizer: 'If there is something you don’t want us to know, you can whisper to our organizer',
            successNotAttendedHelp: 'If you change your mind, please write to us',
            error: 'Error when submitting a form',
            errorCopyInstruction: 'Error submitting the form. Please copy this message by clicking on the icon ',
            errorNote: 'Yes-yes, I was too lazy to make logging and bind some kind of database',
            errorScreenshot: '(or take a screenshot) and send it to me'
        }

    },
}

export function useTranslation() {
    const lang = useLangStore(state => state.lang)

    const t = <T extends keyof typeof translations['RU']>(key: T) => {
        return translations[lang][key]
    }

    return { t, lang }
}
