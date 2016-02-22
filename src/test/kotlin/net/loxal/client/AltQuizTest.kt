/*
 * Copyright 2016 Alexander Orlov <alexander.orlov@loxal.net>. All rights reserved.
 */

package net.loxal.client

import org.w3c.dom.HTMLButtonElement
import kotlin.browser.document

/**
 * Does not work with Kotlin v1.0.0
 */
object AltQuizTest {
    private val test: HTMLButtonElement = document.getElementById("test") as HTMLButtonElement

    init {
        test.onclick = {
        }
    }

    fun triggerTest() {
        test.click()
    }
}