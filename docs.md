# Dokumentation

# P5.js

### Einsatz der P5.js Library
Die P5.js Library (https://p5js.org) ist eine Javascript Bibliothek, die einfache graphische Darstellung im Browser ermöglicht. Dadruch ist multiple Platformkompatibilität von Beginn an gegeben. Außerdem kann das Spiel auf einem Webserver bereitsgestellt werden, was eine Installation überflüssig macht.

### Aufbau eines P5.js Programmes.
In HTML muss zuerst die p5.js in einem Script-Tag Library geladen werden:
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.6.0/p5.min.js"></script>
```
Außerdem wird Ein Div-Container definiert, in dem später die Zeichenfläche untergebracht wird.
```html
<div id="canvasdiv" class="canvas" hidden>
	<p>Loading</p>
</div>
```

Zuletzt wird das UI für den Multiplayer Chat definiert.
```html
<div class="chat-wrapper">
    <ol class="chat-messages" id="chat-ol" reversed="reversed">
    </ol>

    <form id="chat-form">
        <input type=text id="chat-input" name="msg">
        <button type=submit>Senden</button>
    </form>
</div>
```

# Allgemeines Design
Die UI-Komponenten werden als Klassen implementiert. Sie beinhalten eine ```void draw()``` Methode, die regelmäßig aufgerufen wird, um die Inhalte zu rendern.



# class TitleScreen
Die TitleScreen Klasse stellt das Titelbild und die Knöpfe "Zöcken" und "Tutorial" dar. Außerdem gibt es eine Animation, die abgespielt wird.

### void draw()
Hier werden die UI-Elemente des Titelbildschirms gerendert.
Besonders interessant ist hier die Umsetzung der Animation:
Damit diese Animation der Klasse ```FallingAnimation``` optisch angenehm integriert werden kann, muss das Hintergrundbild auf mehrere Ebenen aufgeteilt werden. Das ist möglich durch die Klasse ```LayeredImage```, indem einzelne Schichten als separate Schichten geladen werden und später einzeln gerendert werden. Die Reihenfolge ist dann so: Hintergrund, Animation, Schriftzug und zuletzt der Businessmann.

# class FallingAnimation

### constrcutor(int count, float fallingSpeed, boolean isContinuous)
Hier wird die Klasse initialisiert. In einer Liste ```this.falling```  werden einige Objekte der Klasse ```Falling``` gespeichert, welche die eigentlichen Bestandteile der Animation sind.

### void draw()
Hier werden zwei weitere Methoden aufgerufen: ```updateFalling()``` und ```drawFalling()```

### void updateFalling()
Für jedes Element aus ```this.falling``` wird die Methode ```void move()``` aufgerufen.

### void drawFalling()


# class GameScreen
In der GameScreen Klasse werden alle wesentlichen Bestandteile des Spiels verwaltet: Wheel, Field und indirekt auch BetLogic.

### void draw()
Hier findet die Render-Routine während des Spielverlaufes ab. Dabei werden die Draw-Methoden der untergeordneten UI-Komponenten aufgerufen.




# class Wheel
Diese Klasse rendert das Roulette-Rad und definiert die Logik für die Glückszahl.

### void spinLogic()
Hier wird die Logik für die Rotation implementiert. Theta ist dabei der Winkel des Rades, Omega ist die Winkelgeschwindigkeit. Der Ansatz ist recht simpel, da es sich hier nur um eine exponentielle Abnahme der Winkelgeschwindigkeit Omega handlet. Dies findet mit der Wachstumsrate von 0.99 pro Frame statt. Bei 60 Frames pro Sekunde entspricht das 54.7%. Jede Sekunde verlangsamt sich das Rad also um 45.3 %.

### void drawWithRender()
In dieser Methode wird das Rad dynamisch gerendet. Also werden die Kreisabschnitte mit Zahlen live dargestellt. Dieser Ansatz hatte negative Effekte auf die Performance des Spiels.

### void draw()
Alternativ zu ```drawWithRender()``` bietet diese Methode eine Möglichkeit das Rad darzustellen. Allerdings wird hier ein Screenshot des vorher gerenderten Rades als Bild geladen und dargestellt. Das spart einige Renderzeit ein und verbessert somit die Gesamtleistung.


# class BetLogic
Diese Klasse generiert speichert die existierenden Wetten des Spielers, die Multiplikatoren für die entsprechenden Spielfelder und den aktuellen Kontostand des Spielers. Außerdem werden Kontostand und Wetten auch von dieser Klasse gerendert.

### void bet()

### void checkForWin(str chosenField)
Wenn das Roulette Rad der Klasse ```Wheel``` stehen bleibt und so eine Glückszahl ausgewählt wird, wird diese an die Methode ```void checkForWin(str chosenField)``` übergeben, welche alle Wetten prüft und den resultierenden, neuen Kontostand errechnet.


# class Button
Ein simples UI-Element für einen Knopf.

### void draw()
Stellt ein Rechteck mit Textinhalt dar und prüft auf ein Klick-Ereignis.

### void on_click()
Im Fall eines Klick-Ereignisses wird diese Methode aufgerufen.
