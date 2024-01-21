'use client'

import { useRouter, usePathname } from 'next/navigation'
import AnimatedLink from '@root/components/animated/Link'
import AnimatedButton from '@root/components/animated/Button'
import Image from 'next/image';

export default function GlobalError({ error, reset }) {

    const router = useRouter();
    const pathname = usePathname();

    return (
        <html>
            <body>
                <section style={{ marginBottom: '-10px' }}>
                    <div className="container">
                        <div className="mx-auto py-30 px-30 size-14">
                            <h1 className="heading mb-60">Ошибка с кодом {error.code}, со следующим сообщением:</h1>
                            <p className="subheading mb-60">{error.message}</p>
                            <p className="subheading mb-60">
                                <AnimatedButton className="btn style-default link" onClick={e => router.back()}>
                                    Вернуться назад
                                </AnimatedButton>
                            </p>
                            <p className="subheading mb-60">
                                <AnimatedLink href="/" isButtonHtml={true}
                                    className="btn style-default link"
                                >
                                    Перейти на главную
                                </AnimatedLink>
                            </p>
                            <p className="subheading mb-60">
                                <AnimatedLink href="/login" isButtonHtml={true}
                                    className="btn style-default link"
                                >
                                    Логин
                                </AnimatedLink>
                            </p>

                            <div className="d-flex justify-content: center;">
                                <div className="w-100 w-md-33 w-lg-50 mx-auto mt-30 mb-100">
                                    {/* <Image
                                className="image-404"
                                src="/assets/img/404-image.png"
                                alt=""
                                width={920}
                                height={390}
                            /> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </body>
        </html>
    )
}