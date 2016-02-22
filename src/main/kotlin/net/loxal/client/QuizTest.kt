/*
 * Copyright 2016 Alexander Orlov <alexander.orlov@loxal.net>. All rights reserved.
 */

package net.loxal.client

import org.w3c.dom.HTMLButtonElement
import kotlin.browser.document

object QuizTest {
    private val test: HTMLButtonElement = document.getElementById("test") as HTMLButtonElement

    init {
        test.onclick = {
            Quiz.test()
        }
    }
}