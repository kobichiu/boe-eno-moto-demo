export default function Footer () {
    return (
        <footer className="w-full py-4 flex flex-col items-center justify-center gap-4">
            <img src="/footer/uni_icon.webp" alt="University of Tuebingen"
                 className="w-32 h-8 object-contain opacity-80"></img>

            <span className="text-xs text-center text-gray-500">
                Boe eno moto by Fabrício Ferraz Gerardi and Hing Man Chiu is licensed under a &nbsp;
                <a className="underline" href="https://creativecommons.org/licenses/by/4.0/"
                   rel="noopener noreferrer" target="_blank">
                    Creative Commons Attribution 4.0 International License
                </a>
                </span>
        </footer>
    )
}