/*
 * Copyright 2016 Alexander Orlov <alexander.orlov@loxal.net>. All rights reserved.
 */

package net.loxal.client

import kotlin.browser.document

val vote = document.getElementById("vote")

fun main(vararg args: String) {
    console.log("textContent: ${vote?.textContent}")
    console.log("nodeValue: ${vote?.nodeValue}")
}
